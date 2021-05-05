export type Gender = "male" | "female";

export interface AttachmentDTO {
  fileName: string;
  type: string;
  file?: Buffer;
  key?: string;
}
