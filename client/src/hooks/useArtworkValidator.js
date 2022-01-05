import { useCallback } from "react";
import { formatArtworkValues } from "../../../common/helpers";
import { deleteEmptyValues } from "../utils/helpers";

export const useArtworkValidator = (schema) =>
  useCallback(
    async (data) => {
      try {
        const formattedData = deleteEmptyValues(formatArtworkValues(data));
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
