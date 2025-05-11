import BreadCrumb from "../../../../components/admin/breadcrumb";
import DropZone from "../../../../components/admin/panels/drop-zone";

export default function Page() {
  return (
    <div>
      <BreadCrumb pageName="Subir datos en formato excel" />
      <DropZone />
    </div>
  );
}
