import { useCallback } from "react";
import { formatLicenseValues } from "../../../common/helpers";
import { deleteEmptyValues } from "../utils/helpers";

export const useLicenseValidator = (schema) =>
  useCallback(
    async (data) => {
      try {
        const formattedData = deleteEmptyValues(formatLicenseValues(data));
        const values = await schema.validate(formattedData, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [schema]
  );
