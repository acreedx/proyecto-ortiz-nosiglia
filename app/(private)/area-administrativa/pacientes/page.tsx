import BreadCrumb from "../../../../components/admin/breadcrumb";
import PatientTable from "../../../../components/admin/tables/patient-table";
import { prisma } from "../../../../lib/prisma/prisma";
export default async function Page() {
  const pacientes = await prisma.patient.findMany({
    include: {
      user: true,
    },
  });
  const items = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
    { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
    { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
    { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
    { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
    { id: 6, name: "asd", category: "Electronics", price: 999.99 },
    { id: 7, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
    { id: 8, name: "Desk Chair", category: "Furniture", price: 150.0 },
    { id: 9, name: "Smartphone", category: "Electronics", price: 799.99 },
    { id: 10, name: "asdasd", category: "Accessories", price: 199.99 },
  ];
  return (
    <div>
      <BreadCrumb pageName="Pacientes" />
      <PatientTable items={items} pacientes={pacientes} />
    </div>
  );
}
