import { isObjectEmpty } from "../../common/helpers";
import { License } from "../../entities/License";
import {
  generateLicenseFingerprint,
  generateLicenseIdentifiers,
} from "../../utils/helpers";
import {
  ARTWORK_SELECTION,
  LICENSE_SELECTION,
  USER_SELECTION,
} from "../../utils/selectors";

const LICENSE_ACTIVE_STATUS = true;

// $Needs testing (mongo -> postgres)
export const fetchLicenseByFingerprint = async ({
  licenseFingerprint,
  assigneeIdentifier,
  assignorIdentifier,
  connection,
}) => {
  // return await License.findOne({
  //   where: [{ fingerprint: licenseFingerprint, active: true }],
  //   relations: ["artwork"],
  // });

  const foundLicense = await connection
    .getRepository(License)
    .createQueryBuilder("license")
    .leftJoinAndSelect("license.owner", "buyer")
    .leftJoinAndSelect("license.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "seller")
    .select([
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ASSIGNEE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
      ...USER_SELECTION["ESSENTIAL_INFO"]("buyer"),
      ...USER_SELECTION["ESSENTIAL_INFO"]("seller"),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where("license.fingerprint = :fingerprint AND license.active = :active", {
      fingerprint: licenseFingerprint,
      active: LICENSE_ACTIVE_STATUS,
    })
    .getOne();
  if (!isObjectEmpty(foundLicense)) {
    if (foundLicense.assigneeIdentifier !== assigneeIdentifier) {
      delete foundLicense.assignee;
      delete foundLicense.assigneeIdentifier;
    }
    if (foundLicense.assignorIdentifier !== assignorIdentifier) {
      delete foundLicense.assignor;
      delete foundLicense.assignorIdentifier;
    }
  }
  console.log(foundLicense);
  return foundLicense;
};

// $Needs testing (mongo -> postgres)
export const addNewLicense = async ({
  licenseId,
  userId,
  sellerId,
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

  const { licenseFingerprint } = generateLicenseFingerprint();
  const { licenseAssigneeIdentifier, licenseAssignorIdentifier } =
    generateLicenseIdentifiers();

  const savedLicense = await connection
    .createQueryBuilder()
    .insert()
    .into(License)
    .values([
      {
        id: licenseId,
        ownerId: userId,
        sellerId,
        artworkId,
        fingerprint: licenseFingerprint,
        assignee: licenseData.licenseAssignee,
        assigneeIdentifier: licenseAssigneeIdentifier,
        assignor: licenseData.licenseAssignor,
        assignorIdentifier: licenseAssignorIdentifier,
        company: licenseData.licenseCompany,
        type: licenseData.licenseType,
        price: licenseData.licensePrice,
        active: true,
      },
    ])
    .execute();
  console.log(savedLicense);
  return savedLicense;
};
