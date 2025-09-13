import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (
  filter = {},
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc'
) => {
  const skip = (page - 1) * perPage;

  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const data = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  const totalItems = await Contact.countDocuments(filter);

  return { data, totalItems };
};

export const getContactById = async (id) => Contact.findById(id);
export const createContact = async (data) => Contact.create(data);
export const patchContactById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const updateContactById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true, overwrite: true });

export const deleteContactById = async (id) => Contact.findByIdAndDelete(id);
