import License from "../../models/license";

export const fetchLicenseByFingerprint = async ({
  licenseFingerprint,
  session = null,
}) => {
  return await License.findOne({
    fingerprint: licenseFingerprint,
    active: true,
  }).populate("artwork");
};

export const addNewLicense = async ({
  userId,
  artworkData,
  licenseData,
  session = null,
}) => {
  const newLicense = new License();
  newLicense.owner = userId;
  newLicense.artwork = artworkData.id;
  newLicense.fingerprint = crypto.randomBytes(20).toString("hex");
  newLicense.assignee = licenseData.licenseAssignee;
  newLicense.company = licenseData.licenseCompany;
  newLicense.type = licenseData.licenseType;
  newLicense.active = false;
  newLicense.price = artworkData.current[licenseData.licenseType];
  return await newLicense.save({ session });
};
