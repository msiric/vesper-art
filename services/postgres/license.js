import { License } from "../../entities/License";

// $Needs testing (mongo -> postgres)
export const fetchLicenseByFingerprint = async ({ licenseFingerprint }) => {
  return await License.findOne({
    where: [{ fingerprint: licenseFingerprint, active: true }],
    relations: ["artwork"],
  });
};

// $Needs testing (mongo -> postgres)
export const addNewLicense = async ({ userId, artworkData, licenseData }) => {
  const newLicense = new License();
  newLicense.owner = userId;
  newLicense.artwork = artworkData.id;
  newLicense.fingerprint = crypto.randomBytes(20).toString("hex");
  newLicense.assignee = licenseData.licenseAssignee;
  newLicense.company = licenseData.licenseCompany;
  newLicense.type = licenseData.licenseType;
  newLicense.active = false;
  newLicense.price = artworkData.current[licenseData.licenseType];
  return await License.save({ newLicense });
};
