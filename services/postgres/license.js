import { License } from "../../entities/License";

const LICENSE_ACTIVE_STATUS = true;

// $Needs testing (mongo -> postgres)
export const fetchLicenseByFingerprint = async ({
  licenseFingerprint,
  connection,
}) => {
  // return await License.findOne({
  //   where: [{ fingerprint: licenseFingerprint, active: true }],
  //   relations: ["artwork"],
  // });

  const foundLicense = await connection
    .getRepository(License)
    .createQueryBuilder("license")
    .where("license.fingerprint = :fingerprint AND license.active = :active", {
      fingerprint: licenseFingerprint,
      active: LICENSE_ACTIVE_STATUS,
    })
    .getOne();
  console.log(foundLicense);
  return foundLicense;
};

// $Needs testing (mongo -> postgres)
export const addNewLicense = async ({
  licenseId,
  userId,
  artworkId,
  licenseData,
  connection,
}) => {
  /*   const newLicense = new License();
  newLicense.owner = userId;
  newLicense.artwork = artworkData.id;
  newLicense.fingerprint = crypto.randomBytes(20).toString("hex");
  newLicense.assignee = licenseData.licenseAssignee;
  newLicense.company = licenseData.licenseCompany;
  newLicense.type = licenseData.licenseType;
  newLicense.active = false;
  newLicense.price = artworkData.current[licenseData.licenseType];
  return newLicense; */

  const savedLicense = await connection
    .createQueryBuilder()
    .insert()
    .into(License)
    .values([
      {
        id: licenseId,
        ownerId: userId,
        artworkId,
        fingerprint: crypto.randomBytes(20).toString("hex"),
        assignee: licenseData.licenseAssignee,
        company: licenseData.licenseCompany,
        type: licenseData.licenseType,
        price: licenseData.licensePrice,
        active: false,
      },
    ])
    .execute();
  console.log(savedLicense);
  return savedLicense;
};
