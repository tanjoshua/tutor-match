import { Request, Response } from "express";

import HttpError from "../../errors/HttpError";
import Invoice, {
  InvoiceEntry,
  InvoicePayment,
  PaymentMethod,
} from "../models/Invoice";
import { generatePaynowQR } from "../../utils/paynowQrService";
import { collections } from "../../services/database.service";
import { ObjectId } from "mongodb";

require("express-async-errors");
export const getInvoices = async (req: Request, res: Response) => {
  // retrieve options
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;

  // process filter queries
  const searchQuery: any[] = [];
  if (req.query.state) {
    searchQuery.push({ state: req.query.state });
  }

  // process search query
  if (req.query.search) {
    searchQuery.push({
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { comments: { $regex: req.query.search } },
      ],
    });
  }

  // consolidate filters
  // TODO: filter on owner
  let filter = {};
  if (searchQuery.length !== 0) {
    filter = { $and: searchQuery };
  }

  const totalCount = await collections.invoices!.countDocuments(filter);
  const invoiceDocuments = await collections
    .invoices!.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: "user",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
    ])
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .toArray();

  // convert invoice documents into invoice objects to allow for usage of helper functions
  // shouldn't run into scalability issues due to pagination
  const invoices = [];
  for (const doc of invoiceDocuments) {
    const invoice = new Invoice();
    Object.assign(invoice, doc);
    invoices.push(invoice);
  }

  res.json({ invoices: invoices, count: totalCount });
};

export const getInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoiceDocument = await collections.invoices
    ?.aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "user",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
    ])
    .next();
  if (!invoiceDocument) {
    throw new HttpError(404, "Invoice not found");
  }
  const invoice = new Invoice();
  Object.assign(invoice, invoiceDocument);

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
  const owner = req.sessionUser!;

  // process invoice entries
  const invoiceEntries = [];
  if (req.body.entries) {
    for (let entry of req.body.entries) {
      const invoiceEntry = new InvoiceEntry(
        entry.name,
        entry.quantity,
        entry.unitPrice
      );
      invoiceEntries.push(invoiceEntry);
    }
  }

  // create invoice object
  const invoice = new Invoice();
  invoice.invoiceNumber = owner.nextInvoiceNumber;
  owner.nextInvoiceNumber += 1; // increment invoice number count should I handle race condition?
  invoice.title = req.body.title;
  invoice.owner = owner._id;
  invoice.state = req.body.state;
  invoice.entries = invoiceEntries;
  invoice.hasGST = !!req.body.hasGST;
  invoice.comments = req.body.comments;

  // process payment fields
  if (req.body.payment) {
    const invoicePayment = new InvoicePayment(
      req.body.payment.method,
      invoice.total,
      String(invoice.invoiceNumber)
    );
    if (req.body.payment.method == PaymentMethod.INSTRUCTION) {
      invoicePayment.instructions = req.body.payment;
    } else if (req.body.payment.method == PaymentMethod.PAYNOW) {
      invoicePayment.customPaynowRecipient =
        req.body.payment.customPaynowRecipient;
    }
    invoice.payment = invoicePayment;
  }

  const result = await collections.invoices?.insertOne(invoice);

  res.status(201).json(result);
};

export const replaceInvoice = async (req: Request, res: Response) => {
  const id = req.body.id;
  const invoice = await collections.invoices!.findOne({
    _id: new ObjectId(id),
  });
  if (!invoice) {
    throw new HttpError(404, "Invoice not found");
  }

  let updatedInvoice: any = {};

  // proces invoice entries
  const invoiceEntries = [];
  if (req.body.entries) {
    for (let entry of req.body.entries) {
      const invoiceEntry = new InvoiceEntry(
        entry.name,
        entry.quantity,
        entry.unitPrice
      );
      invoiceEntries.push(invoiceEntry);
    }
  }
  updatedInvoice.entries = invoiceEntries;

  // process payment fields
  if (req.body.payment) {
    const invoicePayment = new InvoicePayment(
      req.body.payment.method,
      invoice.total,
      String(invoice.invoiceNumber)
    );
    if (req.body.payment.method == PaymentMethod.INSTRUCTION) {
      invoicePayment.instructions = req.body.payment;
    } else if (req.body.payment.method == PaymentMethod.PAYNOW) {
      invoicePayment.customPaynowRecipient =
        req.body.payment.customPaynowRecipient;
    }
    updatedInvoice.payment = invoicePayment;
  }

  // update fields
  updatedInvoice.title = req.body.title;
  updatedInvoice.state = req.body.state;
  updatedInvoice.hasGST = req.body.hasGST;
  updatedInvoice.comments = req.body.comments;

  const newInvoice = await collections.invoices!.updateOne(
    { _id: new ObjectId(id) },
    updatedInvoice
  );
  res.json(newInvoice);
};

export const updateState = async (req: Request, res: Response) => {
  const id = req.body.id;
  const invoice = await collections.invoices!.updateOne(
    { _id: new ObjectId(id) },
    { state: req.body.state }
  );
  if (!invoice) {
    throw new HttpError(404, "Invoice not found");
  }

  res.json(invoice);
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await collections.invoices!.deleteOne({
    _id: new ObjectId(id),
  });

  if (!result.deletedCount) {
    throw new HttpError(404, "Invoice not found");
  }

  res.status(202).json();
};
