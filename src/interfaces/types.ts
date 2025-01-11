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
export interface IAwsLead {
  version: string;
  spmsId: string;
  leads: ILead[];
}
export interface IResultGetFolderContent {
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
