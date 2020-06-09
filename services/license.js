import mongoose from 'mongoose';
import License from '../models/license.js';
import createError from 'http-errors';

export const fetchLicenseByFingerprint = async ({
  fingerprint,
  session = null,
}) => {
  return await License.findOne({
    fingerprint: fingerprint,
    active: true,
  }).populate('artwork');
};
