import { Breadcrumb } from "@chakra-ui/react";
import { LuHouse } from "react-icons/lu";

export default function BreadCrumb({ pageName }: { pageName: string }) {
  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link
            href="/area-administrativa"
            _hover={{ color: "orange.600" }}
            className="duration-150"
          >
            <LuHouse />
            Área administrativa
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>{pageName}</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
}
