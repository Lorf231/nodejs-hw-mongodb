import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (
  userId,
  filter = {},
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc'
) => {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const query = { ...filter, userId };

  const data = await Contact.find(query)
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  const totalItems = await Contact.countDocuments(query);

  return { data, totalItems };
};

export const getContactById = async (userId, id) => {
  return Contact.findOne({ _id: id, userId });
};

export const createContact = async (userId, data) => {
  return Contact.create({ ...data, userId });
};

export const patchContactById = async (userId, id, data) => {
  return Contact.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true, runValidators: true }
  );
};

export const updateContactById = async (userId, id, data) => {
  return Contact.findOneAndUpdate(
    { _id: id, userId },
    data,
    { new: true, runValidators: true, overwrite: true }
  );
};

export const deleteContactById = async (userId, id) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};


