import { ID365LeadData } from "#interfaces/types.js";

export const d365ToAceLead = (crmLeadData: ID365LeadData) => {
  return {
    version: "2.0",
    spmsId: "12122",
    leads: [
      {
        useCaseWorkLoad: crmLeadData.subject,
        state: crmLeadData.address1_stateorprovince,
        phone: crmLeadData.mobilephone,
        partnerCrmLeadId: crmLeadData.smt_codigo,
        industry: crmLeadData.jobtitle,
        fullname: crmLeadData.firstname,
        email: crmLeadData.emailaddress1,
        company: crmLeadData.companyname,
        city: crmLeadData.address1_city,
        apnCrmUniqueIdentifier: crmLeadData.ne_optaws,
      },
    ],
  };
};

export const d365ToAceLeadOPT = (crmLeadOPTData: ID365LeadData) => {
  return {
    version: "2.0",
    spmsId: "12122",
    opportunities: [
      {
        partnerProjectTitle: crmLeadOPTData.subject,
        state: crmLeadOPTData.address1_stateorprovince || null,
        customerPhone: crmLeadOPTData.mobilephone,
        partnerCrmUniqueIdentifier: crmLeadOPTData.smt_codigo,
        industry: crmLeadOPTData.jobtitle,
        customerFirstName: crmLeadOPTData.firstname,
        customerEmail: crmLeadOPTData.emailaddress1,
        customerCompanyName: crmLeadOPTData.companyname,
        city: crmLeadOPTData.address1_city,
        apnCrmUniqueIdentifier: crmLeadOPTData.ne_optaws,
      },
    ],
  };
};

export const d365ToLeadAccept = (id: string, crmCode: string, status: string) => {
  return {
    version: "2.0",
    spmsId: "12122",
    leads: [
      {
        apnCrmUniqueIdentifier: id,
        partnerCrmLeadId: crmCode,
        currentLeadStage: status,
      },
    ],
  };
};

export const d365ToLeadQualifyClose = (id: string, crmCode: string, status: string) => {
  return {
    version: "2.0",
    spmsId: "12122",
    leads: [
      {
        apnCrmUniqueIdentifier: id,
        partnerCrmLeadId: crmCode,
        status,
        leadStatusReason: status === "Disqualified" ? "Other" : null,
      },
    ],
  };
};
