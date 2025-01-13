export interface ID365LeadData {
  subject: string;
  address1_stateorprovince: string;
  mobilephone: string;
  smt_codigo: string;
  jobtitle: string;
  firstname: string;
  emailaddress1: string;
  companyname: string;
  address1_city: string;
  ne_optaws: string;
}
export interface ILead {
  website?: string;
  useCaseWorkload: string;
  title: string;
  streetAddress?: string;
  status: "Open" | "Accepet";
  state?: string;
  segmentCompanySize?: string;
  projectDescription?: string;
  postalCode?: string;
  phone?: string;
  partnerCrmLeadId: string;
  levelofAWSUsage?: string;
  leadStatusReason?: string;
  leadSource?: string;
  leadOwnerName: "Alianças Nextios";
  leadOwnerEmail: string;
  leadAge: number;
  industry: string;
  fullName: string;
  email: string;
  currentLeadStage: string;
  country?: string;
  company: string;
  city?: string;
  campaignName: string;
  campaignMemberStatus?: string;
  apnCrmUniqueIdentifier: string;
}

export interface IAWSData {
  version: string;
  spmsId: string;
  opportunities?: unknown[];
  leads?: unknown[];
}
export interface IOPT {
  website?: string;
  useCaseWorkload: string;
  title: string;
  streetAddress?: string;
  status: "Open" | "Accepet";
  state?: string;
  segmentCompanySize?: string;
  projectDescription?: string;
  postalCode?: string;
  phone?: string;
  partnerCrmLeadId: string;
  levelofAWSUsage?: string;
  leadStatusReason?: string;
  leadSource?: string;
  leadOwnerName: "Alianças Nextios";
  leadOwnerEmail: string;
  leadAge: number;
  industry: string;
  fullName: string;
  email: string;
  currentLeadStage: string;
  country?: string;
  company: string;
  city?: string;
  campaignName: string;
  campaignMemberStatus?: string;
  apnCrmUniqueIdentifier: string;
}
export interface IAwsLead {
  version: string;
  spmsId: string;
  leads: ILead[];
}
export interface IAwsOpt {
  version: string;
  spmsId: string;
  opportunities: IOPT[];
}
export interface IKeyAndContent {
  Key: string | undefined;
  content: ILead;
}
export interface IPrefix {
  prefix: string;
}
export interface IPutDataBody {
  fileName: string;
  content: string;
}
export interface IProcessedResult {
  success: string;
  spmsId: number;
  s3BucketName: string | null;
  isApiError: boolean;
  inboundApiResults: [
    {
      warnings: string | null;
      partnerCrmUniqueIdentifier: string | null;
      isSuccess: boolean;
      errors: null;
      apnCrmUniqueIdentifier: string;
    },
  ];
  fileName: string;
  fileApnProcessedDT: string;
  apiErrors: string | null;
}
