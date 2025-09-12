import { Contact } from '../models/contactModel.js';

export const getAllContacts = async (filter = {}, options = {}) => {
  return Contact.find(filter, null, options);
};

export const getContactById = async (id) => {
  return Contact.findById(id);
};

export const createContact = async (data) => {
  return Contact.create(data);
};

export const patchContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

export const updateContactById = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    overwrite: true
  });
};

export const deleteContactById = async (id) => {
  return Contact.findByIdAndDelete(id);
};