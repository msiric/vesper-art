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

export const fetchLicenseByFingerprint = async ({
  licenseFingerprint,
  assigneeIdentifier,
  assignorIdentifier,
  connection,
}) => {
  const foundLicense = await connection
    .getRepository(License)
    .createQueryBuilder("license")
    .leftJoinAndSelect("license.owner", "buyer")
    .leftJoinAndSelect("license.artwork", "artwork")
    .leftJoinAndSelect("artwork.owner", "seller")
    .select([
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["USAGE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNEE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
      ...USER_SELECTION["ESSENTIAL_INFO"]("buyer"),
      ...USER_SELECTION["ESSENTIAL_INFO"]("seller"),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where("license.fingerprint = :fingerprint AND license.active = :active", {
      fingerprint: licenseFingerprint,
      active: LICENSE_SELECTION.ACTIVE_STATUS,
    })
    .getOne();
  if (!isObjectEmpty(foundLicense)) {
    if (foundLicense.assigneeIdentifier !== assigneeIdentifier) {
      delete foundLicense.assignee;
      delete foundLicense.usage;
      delete foundLicense.company;
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

export const addNewLicense = async ({
  licenseId,
  userId,
  sellerId,
  artworkId,
  licenseData,
  connection,
}) => {
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
        usage: licenseData.licenseUsage,
        company: licenseData.licenseCompany,
        type: licenseData.licenseType,
        price: licenseData.licensePrice,
        active: LICENSE_SELECTION.ACTIVE_STATUS,
      },
    ])
    .execute();
  console.log(savedLicense);
  return savedLicense;
};
