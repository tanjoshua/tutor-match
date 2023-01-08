import { Request, Response } from "express";
import { wrap } from "@mikro-orm/core";

import { DI } from "../..";
import HttpError from "../../errors/HttpError";
import { Invoice, InvoiceEntry } from "../entities";
import { InvoicePayment, PaymentMethod } from "../entities/Payment";
import { generatePaynowQR } from "../../utils/paynowQrService";

require("express-async-errors");
export const getInvoices = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  // process search queries
  const searchQuery: any[] = [];
  if (req.query.state) {
    searchQuery.push({ state: req.query.state });
  }
  let filter = {};
  if (searchQuery.length !== 0) {
    filter = { $and: searchQuery };
  }

  // determine order
  let orderBy: any = { createdAt: "desc" };

  const [invoices, count] = await DI.invoiceRepository.findAndCount(filter, {
    offset: (+page - 1) * +limit,
    limit: +limit,
    orderBy,
  });

  res.json({ invoices: invoices, count });
};

export const getInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await DI.em.findOne(Invoice, { id });
  if (!invoice) {
    throw new HttpError(404, "Invoice not found");
  }

  // compute qr code if necessary
  if (invoice.payment && invoice.payment.method == PaymentMethod.PAYNOW) {
    const qrCode = generatePaynowQR({
      uen: invoice.payment.customPaynowRecipient?.uen!,
      phoneNumber: invoice.payment.customPaynowRecipient?.singaporePhoneNumber!,
      total: invoice.total,
      editable: false,
      reference: invoice.invoiceNumber.toString(),
    });
    invoice.payment.qrCode = qrCode;
  }

  res.json({ invoice });
};

export const createInvoice = async (req: Request, res: Response) => {
  // create schedule
  const owner = req.user!;

  const invoice = new Invoice();
  invoice.owner = owner;
  invoice.invoiceNumber = owner.nextInvoiceNumber;
  owner.nextInvoiceNumber += 1; // should I handle race condition?

  invoice.title = req.body.title;
  invoice.state = req.body.state;
  invoice.hasGST = !!req.body.hasGST;
  invoice.comments = req.body.comments;

  // process invoice entries
  if (req.body.entries) {
    for (let entry of req.body.entries) {
      const invoiceEntry = new InvoiceEntry();
      invoiceEntry.name = entry.name;
      invoiceEntry.quantity = entry.quantity;
      invoiceEntry.unitPrice = entry.unitPrice;
      invoice.entries.push(invoiceEntry);
    }
  }

  // payment fields
  if (req.body.payment) {
    const invoicePayment = new InvoicePayment();
    invoicePayment.total = invoice.total;
    invoicePayment.reference = String(invoice.invoiceNumber);
    invoicePayment.method = req.body.payment.method;
    if (req.body.payment.method == PaymentMethod.INSTRUCTION) {
      invoicePayment.instructions = req.body.payment;
    } else if (req.body.payment.method == PaymentMethod.PAYNOW) {
      invoicePayment.customPaynowRecipient =
        req.body.payment.customPaynowRecipient;
    }
    invoice.payment = invoicePayment;
  }

  DI.em.persist(invoice);
  await DI.em.flush();

  res.status(201).json(invoice);
};

export const replaceInvoice = async (req: Request, res: Response) => {
  const id = req.body.id;
  const invoice = await DI.em.findOne(Invoice, { id });
  if (!invoice) {
    throw new HttpError(404, "Invoice not found");
  }

  // update fields
  wrap(invoice).assign({
    state: req.body.state,
    hasGST: req.body.hasGST,
    comments: req.body.comments,
  });

  // replace invoice entries
  const newInvoiceEntries = [];
  for (let entry of req.body.entries) {
    const invoiceEntry = new InvoiceEntry();
    invoiceEntry.name = entry.name;
    invoiceEntry.quantity = entry.quantity;
    invoiceEntry.unitPrice = entry.unitPrice;
    newInvoiceEntries.push(invoiceEntry);
  }
  invoice.entries = newInvoiceEntries;

  // payment fields
  // just recompute everything
  if (req.body.payment) {
    const invoicePayment = new InvoicePayment();
    invoicePayment.total = invoice.total;
    invoicePayment.reference = String(invoice.invoiceNumber);
    invoicePayment.method = req.body.payment.method;
    if (req.body.payment.method == PaymentMethod.INSTRUCTION) {
      invoicePayment.customPaynowRecipient = undefined; // nullify potential previous values
      invoicePayment.instructions = req.body.payment;
    } else if (req.body.payment.method == PaymentMethod.PAYNOW) {
      invoicePayment.customPaynowRecipient =
        req.body.payment.customPaynowRecipient;
    }
    invoice.payment = invoicePayment;
  }

  // save
  await DI.em.flush();

  res.json(invoice);
};

export const updateState = async (req: Request, res: Response) => {
  const id = req.body.id;
  const invoice = await DI.em.findOne(Invoice, { id });
  if (!invoice) {
    throw new HttpError(404, "Invoice not found");
  }

  invoice.state = req.body.state;
  // save
  await DI.em.flush();

  res.json(invoice);
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = await DI.em.findOne(Invoice, { id });
  if (!invoice) {
    throw new HttpError(404, "Invoice not found");
  }

  DI.em.removeAndFlush(invoice);
  res.json();
};
