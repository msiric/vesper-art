import { License } from "../../entities/License";

const LICENSE_ACTIVE_STATUS = true;

// $Needs testing (mongo -> postgres)
export const fetchLicenseByFingerprint = async ({ licenseFingerprint }) => {
  // return await License.findOne({
  //   where: [{ fingerprint: licenseFingerprint, active: true }],
  //   relations: ["artwork"],
  // });

  const foundLicense = await getConnection()
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
  artworkData,
  licenseData,
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

  const savedLicense = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(License)
    .values([
      {
        id: licenseId,
        ownerId: userId,
        artworkId: artworkData.id,
        fingerprint: crypto.randomBytes(20).toString("hex"),
        assignee: licenseData.licenseAssignee,
        company: licenseData.licenseCompany,
        type: licenseData.licenseType,
        active: false,
        price: artworkData.current[licenseData.licenseType],
      },
    ])
    .execute();
  console.log(savedLicense);
  return savedLicense;
};
