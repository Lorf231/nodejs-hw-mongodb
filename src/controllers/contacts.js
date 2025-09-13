import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContactById,
  deleteContactById,
} from '../services/contacts.js';

export const handleGetContacts = async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const { type, isFavourite } = req.query;

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const { data, totalItems } = await getAllContacts(
    userId,
    filter,
    page,
    perPage,
    sortBy,
    sortOrder
  );

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
};

export const handleGetContactById = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { contactId } = req.params;

  const contact = await getContactById(userId, contactId);
  if (!contact) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const handleCreateContact = async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  const { userId: _ignored, ...body } = req.body;

  const { name, phoneNumber, contactType } = body;
  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, 'name, phoneNumber and contactType are required');
  }

  const newContact = await createContact(userId, body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const handlePatchContact = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { contactId } = req.params;

  if (!Object.keys(req.body || {}).length) {
    throw createHttpError(400, 'Body must have at least one field');
  }

  const { userId: _ignored, ...body } = req.body;

  const updated = await patchContactById(userId, contactId, body);
  if (!updated) throw createHttpError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const handleDeleteContact = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { contactId } = req.params;

  const deleted = await deleteContactById(userId, contactId);
  if (!deleted) throw createHttpError(404, 'Contact not found');

  res.status(204).send();
};
