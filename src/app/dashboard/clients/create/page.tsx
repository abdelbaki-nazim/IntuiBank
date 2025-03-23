"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@progress/kendo-react-buttons";
import { Stepper } from "@progress/kendo-react-layout";
import {
  Form,
  FormElement,
  Field,
  FormRenderProps,
} from "@progress/kendo-react-form";
import { Input, Checkbox } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Slide } from "@progress/kendo-react-animation";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Typography } from "@progress/kendo-react-common";

import {
  ClientType,
  ActivityType,
  Civility,
  DocumentType,
} from "@/../types/models";
import { Loader } from "@progress/kendo-react-indicators";

import { WizardContext, ClientFormData } from "@/../context/WizardContext";

const formatDate = (date?: Date | string): string => {
  if (!date) return "";
  return typeof date === "string" ? date : date.toISOString().split("T")[0];
};

const required = (value: any) => (value ? "" : "Required");

const StepGeneral = ({
  formRenderProps,
  setClientType,
}: {
  formRenderProps: FormRenderProps;
  setClientType: (type: ClientType) => void;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <Typography.h5>General Information</Typography.h5>
    <Field
      name="client.type"
      component={DropDownList}
      data={[
        { text: "Physical", value: ClientType.PHYSICAL },
        { text: "Moral", value: ClientType.MORAL },
      ]}
      textField="text"
      dataItemKey="value"
      label="Client Type"
      validator={required}
      onChange={(e: any) => {
        setClientType(e.value.value);
        formRenderProps.onChange("client.type", { value: e.value });
      }}
    />
  </div>
);

const StepIdentity = (formRenderProps: FormRenderProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <Typography.h5>Identity Document</Typography.h5>
    <Field
      name="identityDocuments[0].documentType"
      component={DropDownList}
      data={[
        { text: "CNIBE", value: DocumentType.CNIBE },
        { text: "Passport", value: DocumentType.PASSEPORT },
        { text: "Driver License", value: DocumentType.PERMIS_CONDUIRE },
        { text: "Voter Card", value: DocumentType.CARTE_ELECTEUR },
        { text: "Consular Card", value: DocumentType.CARTE_CONSULAIRE },
      ]}
      textField="text"
      dataItemKey="value"
      label="Document Type"
      validator={required}
    />
    <Field
      name="identityDocuments[0].documentNumber"
      component={Input}
      label="Document Number"
      validator={required}
    />
    <Field
      name="identityDocuments[0].issueDate"
      component={Input}
      type="date"
      label="Issue Date"
      validator={required}
      format="yyyy-MM-dd"
    />
    <Field
      name="identityDocuments[0].issuedBy"
      component={Input}
      label="Issued By"
      validator={required}
    />
  </div>
);

const StepCredentials = (formRenderProps: FormRenderProps) => {
  if (
    formRenderProps.valueGetter("client.type").value !== ClientType.PHYSICAL
  ) {
    return null;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography.h5>Credentials (Personal Information)</Typography.h5>
      <Field
        name="personPhysical.civility"
        component={DropDownList}
        data={[
          { text: "Mr.", value: Civility.MR },
          { text: "Mrs.", value: Civility.MRS },
          { text: "Ms.", value: Civility.MS },
          { text: "Miss", value: Civility.MISS },
          { text: "Dr.", value: Civility.DR },
          { text: "Prof.", value: Civility.PROF },
          { text: "Maitre", value: Civility.MAITRE },
        ]}
        textField="text"
        dataItemKey="value"
        label="Civility"
        validator={required}
      />
      <Field
        name="personPhysical.firstName"
        component={Input}
        label="First Name"
        validator={required}
      />
      <Field
        name="personPhysical.middleName"
        component={Input}
        label="Middle Name"
      />
      <Field
        name="personPhysical.lastName"
        component={Input}
        label="Last Name"
        validator={required}
      />
      <Field
        name="personPhysical.maidenName"
        component={Input}
        label="Maiden Name"
      />
      <Field
        name="personPhysical.birthDate"
        component={Input}
        type="date"
        label="Birth Date"
        validator={required}
        format="yyyy-MM-dd"
      />
      <Field
        name="personPhysical.presumed"
        component={Checkbox}
        label="Presumed"
      />
      <Field
        name="personPhysical.birthPlace"
        component={Input}
        label="Birth Place"
        validator={required}
      />
      <Field
        name="personPhysical.gender"
        component={Input}
        label="Gender"
        validator={required}
      />
      <Field
        name="personPhysical.birtCertificateNumber"
        component={Input}
        label="Birth Certificate Number"
      />
      <Field
        name="personPhysical.countryOfBirth"
        component={Input}
        label="Country of Birth"
        validator={required}
      />
      <Field
        name="personPhysical.nationalityOrigin"
        component={Input}
        label="Nationality (Origin)"
        validator={required}
      />
      <Field
        name="personPhysical.nationalityAcquisition"
        component={Input}
        label="Nationality (Acquisition)"
      />
      <Field
        name="personPhysical.maritalStatus"
        component={Input}
        label="Marital Status"
        validator={required}
      />
      <Field
        name="personPhysical.spouseLastName"
        component={Input}
        label="Spouse Last Name"
      />
      <Field
        name="personPhysical.spouseFirstName"
        component={Input}
        label="Spouse First Name"
      />
      <Field
        name="personPhysical.motherMaidenName"
        component={Input}
        label="Mother's Maiden Name"
      />
      <Field
        name="personPhysical.motherFirstName"
        component={Input}
        label="Mother's First Name"
        validator={required}
      />
      <Field
        name="personPhysical.fatherFirstName"
        component={Input}
        label="Father's First Name"
        validator={required}
      />
      <Field
        name="personPhysical.personalAddress"
        component={Input}
        label="Personal Address"
        validator={required}
      />
      <Field
        name="personPhysical.postalCode"
        component={Input}
        label="Postal Code"
        validator={required}
      />
      <Field
        name="personPhysical.city"
        component={Input}
        label="City"
        validator={required}
      />
      <Field
        name="personPhysical.stateDepartment"
        component={Input}
        label="State/Department"
        validator={required}
      />
      <Field
        name="personPhysical.country"
        component={Input}
        label="Country"
        validator={required}
      />
      <Field
        name="personPhysical.landlinePhone"
        component={Input}
        label="Landline Phone"
      />
      <Field
        name="personPhysical.personalMobilePhone"
        component={Input}
        label="Mobile Phone"
        validator={required}
      />
      <Field
        name="personPhysical.personalFax"
        component={Input}
        label="Personal Fax"
      />
      <Field
        name="personPhysical.personalEmail"
        component={Input}
        label="Email"
        validator={required}
      />
    </div>
  );
};

const StepDetailsMoral = (formRenderProps: FormRenderProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <Typography.h5>Company Information</Typography.h5>
    <Field
      name="personMoral.firstName"
      component={Input}
      label="Contact First Name"
    />
    <Field
      name="personMoral.middleName"
      component={Input}
      label="Contact Middle Name"
    />
    <Field
      name="personMoral.lastName"
      component={Input}
      label="Contact Last Name"
    />
    <Field
      name="personMoral.maidenName"
      component={Input}
      label="Contact Maiden Name"
    />
    <Field
      name="personMoral.companyName"
      component={Input}
      label="Company Name"
      validator={required}
    />
    <Field
      name="personMoral.denomination"
      component={Input}
      label="Denomination"
    />
    <Field
      name="personMoral.legalForm"
      component={Input}
      label="Legal Form"
      validator={required}
    />
    <Field
      name="personMoral.businessActivity"
      component={Input}
      label="Business Activity"
      validator={required}
    />
    <Field
      name="personMoral.capital"
      component={Input}
      label="Capital"
      validator={required}
    />
    <Field
      name="personMoral.workforce"
      component={Input}
      type="number"
      label="Workforce"
    />
    <Field
      name="personMoral.headquartersAddress"
      component={Input}
      label="Headquarters Address"
      validator={required}
    />
    <Field
      name="personMoral.postalCode"
      component={Input}
      label="Postal Code"
      validator={required}
    />
    <Field
      name="personMoral.city"
      component={Input}
      label="City"
      validator={required}
    />
    <Field
      name="personMoral.stateDepartment"
      component={Input}
      label="State/Department"
      validator={required}
    />
    <Field
      name="personMoral.taxIdentificationNumber"
      component={Input}
      label="Tax Identification Number"
    />
    <Field
      name="personMoral.statisticalIdentificationNumber"
      component={Input}
      label="Statistical Identification Number"
    />
    <Field
      name="personMoral.businessCreationDate"
      component={Input}
      type="date"
      label="Business Creation Date"
      validator={required}
      format="yyyy-MM-dd"
    />
    <Field
      name="personMoral.annualRevenue"
      component={Input}
      type="number"
      label="Annual Revenue"
    />
    <Field
      name="personMoral.professionalPhone"
      component={Input}
      label="Professional Phone"
      validator={required}
    />
    <Field
      name="personMoral.professionalEmail"
      component={Input}
      label="Professional Email"
      validator={required}
    />
  </div>
);

const StepActivityType = (formRenderProps: FormRenderProps) => {
  if (
    formRenderProps.valueGetter("client.type").value !== ClientType.PHYSICAL
  ) {
    return null;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography.h5>Activity Type</Typography.h5>
      <Field
        name="personPhysical.activityType"
        component={DropDownList}
        data={[
          { text: "Individual", value: ActivityType.INDIVIDUAL },
          { text: "Professional", value: ActivityType.PROFESSIONAL },
        ]}
        textField="text"
        dataItemKey="value"
        label="Select Activity Type"
        validator={required}
      />
    </div>
  );
};

const StepActivity = (formRenderProps: FormRenderProps) => {
  if (
    formRenderProps.valueGetter("client.type").value !== ClientType.PHYSICAL
  ) {
    return null;
  }
  const activityType = formRenderProps.valueGetter(
    "personPhysical.activityType"
  ).value;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography.h5>Activity Details</Typography.h5>
      {activityType === ActivityType.INDIVIDUAL && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field
            name="activity.profession"
            component={Input}
            label="Profession"
            validator={required}
          />
          <Field
            name="activity.employer"
            component={Input}
            label="Employer"
            validator={required}
          />
          <Field
            name="activity.monthlyIncome"
            component={Input}
            type="number"
            label="Monthly Income"
            validator={required}
          />
        </div>
      )}
      {activityType === ActivityType.PROFESSIONAL && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Field
            name="activity.businessFullName"
            component={Input}
            label="Full Business Name"
            validator={required}
          />
          <Field
            name="activity.businessDenomination"
            component={Input}
            label="Business Denomination"
          />
          <Field
            name="activity.legalForm"
            component={Input}
            label="Legal Form"
            validator={required}
          />
          <Field
            name="activity.businessActivity"
            component={Input}
            label="Business Activity"
            validator={required}
          />
          <Field
            name="activity.capital"
            component={Input}
            type="number"
            label="Capital"
            validator={required}
          />
          <Field
            name="activity.workforce"
            component={Input}
            type="number"
            label="Workforce"
          />
          <Field
            name="activity.headquartersAddress"
            component={Input}
            label="Headquarters Address"
            validator={required}
          />
          <Field
            name="activity.businessPostalCode"
            component={Input}
            label="Postal Code"
            validator={required}
          />
          <Field
            name="activity.cityOfBusiness"
            component={Input}
            label="City"
            validator={required}
          />
          <Field
            name="activity.stateDepartment"
            component={Input}
            label="State/Department"
            validator={required}
          />
          <Field
            name="activity.taxIdentificationNumber"
            component={Input}
            label="Tax Identification Number"
          />
          <Field
            name="activity.statisticalIdentificationNumber"
            component={Input}
            label="Statistical Identification Number"
          />
          <Field
            name="activity.businessCreationDate"
            component={Input}
            type="date"
            label="Business Creation Date"
            validator={required}
            format="yyyy-MM-dd"
          />
          <Field
            name="activity.annualRevenue"
            component={Input}
            type="number"
            label="Annual Revenue"
          />
          <Field
            name="activity.professionalPhone"
            component={Input}
            label="Professional Phone"
          />
          <Field
            name="activity.professionalMobile"
            component={Input}
            label="Professional Mobile"
          />
          <Field
            name="activity.professionalFax"
            component={Input}
            label="Professional Fax"
          />
          <Field
            name="activity.professionalEmail"
            component={Input}
            label="Professional Email"
            validator={required}
          />
        </div>
      )}
    </div>
  );
};

export default function ClientCreateWizard() {
  const router = useRouter();
  const [clientType, setClientType] = useState<ClientType>(ClientType.PHYSICAL);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formState, setFormState] = useState<ClientFormData>({
    client: { type: ClientType.PHYSICAL },
    identityDocuments: [
      {
        documentType: DocumentType.CNIBE,
        documentNumber: "",
        issueDate: formatDate(new Date()),
        issuedBy: "",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationState, setNotificationState] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const steps = [
    {
      label: "General",
      component: (props: FormRenderProps) => (
        <StepGeneral
          formRenderProps={props}
          setClientType={(type: ClientType) => {
            setClientType(type);
            props.onChange("client.type", { value: type });
          }}
        />
      ),
      isValid: true,
      visible: true,
    },
    {
      label: "Identity",
      component: StepIdentity,
      isValid: true,
      visible: true,
    },
    {
      label: "Details",
      component: (props: FormRenderProps) =>
        clientType === ClientType.PHYSICAL ? (
          <StepCredentials {...props} />
        ) : (
          <StepDetailsMoral {...props} />
        ),
      isValid: true,
      visible: true,
    },
    {
      label: "Activity Type",
      component: StepActivityType,
      isValid: true,
      visible: clientType === ClientType.PHYSICAL,
    },
    {
      label: "Activity",
      component: StepActivity,
      isValid: true,
      visible: clientType === ClientType.PHYSICAL,
    },
  ];

  const visibleSteps = steps.filter((s) => s.visible !== false);
  const lastStepIndex = visibleSteps.length - 1;
  const isLastStep = currentStep === lastStepIndex;

  const onSubmit = useCallback(
    async (values: { [name: string]: any }, event?: React.SyntheticEvent) => {
      const data = values as ClientFormData;
      setFormState(data);
      if (isLastStep) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/clients", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create client");
          }
          setNotificationState({
            open: true,
            message: "Client created successfully",
            severity: "success",
          });
          setTimeout(() => {
            router.push("/dashboard/clients");
          }, 2000);
        } catch (error: any) {
          setNotificationState({
            open: true,
            message: error.message || "Error creating client",
            severity: "error",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentStep(Math.min(currentStep + 1, lastStepIndex));
      }
    },
    [currentStep, isLastStep, lastStepIndex, router]
  );

  const onPrevClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setCurrentStep(Math.max(currentStep - 1, 0));
    },
    [currentStep]
  );

  return (
    <div style={{ maxWidth: "768px", margin: "auto", padding: "32px" }}>
      <Stepper
        value={currentStep}
        items={visibleSteps.map((s) => ({
          label: s.label,
          isValid: s.isValid,
        }))}
      />
      <div style={{ marginTop: "24px" }}>
        <WizardContext.Provider
          value={{
            currentStep,
            setCurrentStep,
            formState,
            setFormState,
          }}
        >
          <Form
            initialValues={formState}
            onSubmit={onSubmit}
            render={(formRenderProps: FormRenderProps) => (
              <div style={{ alignSelf: "center" }}>
                <FormElement style={{ padding: 20 }}>
                  {visibleSteps[currentStep].component(formRenderProps)}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "40px",
                    }}
                  >
                    <span>
                      Step {currentStep + 1} of {visibleSteps.length}
                    </span>
                    <div>
                      {currentStep !== 0 && (
                        <Button
                          style={{ marginRight: "16px" }}
                          onClick={onPrevClick}
                        >
                          Previous
                        </Button>
                      )}
                      <Button
                        themeColor="primary"
                        onClick={formRenderProps.onSubmit}
                        disabled={isLoading}
                      >
                        {isLastStep ? (
                          isLoading ? (
                            <Loader size="small" />
                          ) : (
                            "Submit"
                          )
                        ) : (
                          "Next"
                        )}
                      </Button>
                    </div>
                  </div>
                </FormElement>
              </div>
            )}
          />
        </WizardContext.Provider>
      </div>
      {notificationState.open && (
        <NotificationGroup
          style={{
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            alignItems: "center",
          }}
        >
          <Slide direction="up">
            <Notification
              type={{ style: notificationState.severity, icon: true }}
              closable={true}
              onClose={() =>
                setNotificationState((prev) => ({ ...prev, open: false }))
              }
              style={{
                marginTop: "16px",
                fontSize: "1rem",
                padding: "8px",
                minWidth: "160px",
              }}
            >
              {notificationState.message}
            </Notification>
          </Slide>
        </NotificationGroup>
      )}
    </div>
  );
}
