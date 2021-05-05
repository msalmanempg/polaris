export const EMAIL_REGEX = "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$";

export const CNIC_REGEX = /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/;

export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\-\s]+$/;

export const NUMERIC_REGEX = /^[0-9]+$/;

export const GOVT_ID_MASK = {
  cnicMask: "00000-0000000-0",
  nicopMask: "000000-0000000-0",
};

export const FORMAT_DATE = {
  fullDateFormate: "d, MMM yyyy",
};

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: "d, MMM yyyy",
  },
  display: {
    dateInput: "d, MMM yyyy",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
export const PROJECT_LOGO_IMG_DIMENSIONS = { width: 512, height: 512 };
export const USER_PROFILE_IMG_DIMENSIONS = { width: 600, height: 600 };
export const ALLOWED_IMAGE_TYPES = ".jpg,.jpeg,.png,.svg";
export const ALLOWED_EXCEL_TYPES =
  ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";
