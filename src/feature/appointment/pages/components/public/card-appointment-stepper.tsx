interface Props {
  form: any;
}

export default function AppointmentStepper({ form }: Props) {
  const steps = ["Empresa","Serviço","Data","Horário","Seus dados"];

  return (
    <div className="flex items-center gap-6 mb-6">
      {steps.map((step, index) => {
        const active =
          (index === 0 && form.companyId) ||
          (index === 1 && form.serviceId) ||
          (index === 2 && form.preferredDate) ||
          (index === 3 && form.preferredTime) ||
          (index === 4 && form.clientName);

        return (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
              ${active ? "bg-teal-600 text-white shadow-md" : "bg-slate-200 text-slate-600"}`}>
              {index + 1}
            </div>
            <span className="text-sm font-medium">{step}</span>
          </div>
        );
      })}
    </div>
  );
}