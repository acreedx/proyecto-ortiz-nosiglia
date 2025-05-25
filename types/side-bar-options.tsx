import { JSX } from "react";
import { FaHospitalUser } from "react-icons/fa";
import {
  LuBookOpen,
  LuCalendar,
  LuCog,
  LuCreditCard,
  LuGauge,
  LuMonitor,
  LuUser,
} from "react-icons/lu";
export interface menu {
  name: string;
  menuItems: {
    icon: JSX.Element;
    label: string;
    route: string;
    children: {
      label: string;
      route: string;
      permissionCode: string[];
    }[];
  }[];
}
export const menuOptions: menu[] = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <LuGauge color="white" />,
        label: "Administración",
        route: "#",
        children: [
          {
            label: "Panel de control",
            route: "/area-administrativa/dashboard",
            permissionCode: ["dsh_adm"],
          },
        ],
      },
      {
        icon: <FaHospitalUser color="white" />,
        label: "Gestión de pacientes",
        route: "#",
        children: [
          {
            label: "Pacientes",
            route: "/area-administrativa/pacientes",
            permissionCode: ["dsh_pct_adm"],
          },
          {
            label: "Organizaciones",
            route: "/area-administrativa/organizaciones",
            permissionCode: ["dsh_org_adm"],
          },
          {
            label: "Reportes",
            route: "/area-administrativa/reportes",
            permissionCode: ["dsh_pct_adm", "dsh_org_adm"],
          },
        ],
      },
      {
        icon: <LuCalendar color="white" />,
        label: "Gestión de citas",
        route: "#",
        children: [
          {
            label: "Citas",
            route: "/area-administrativa/citas",
            permissionCode: ["dsh_cts_adm"],
          },
          {
            label: "Citas del dentista",
            route: "/area-administrativa/citas-dentista",
            permissionCode: ["dsh_cts_adm_dent"],
          },
          {
            label: "Reportes",
            route: "#",
            permissionCode: ["dsh_cts_adm"],
          },
        ],
      },
      {
        icon: <LuUser color="white" />,
        label: "Gestión de usuarios",
        route: "#",
        children: [
          {
            label: "Usuarios",
            route: "/area-administrativa/usuarios",
            permissionCode: ["dsh_usu_adm"],
          },
          {
            label: "Roles",
            route: "/area-administrativa/roles",
            permissionCode: ["dsh_rol_adm"],
          },
          {
            label: "Eventos del sistema",
            route: "/area-administrativa/eventos-del-sistema",
            permissionCode: ["dsh_log_adm"],
          },
          {
            label: "Reportes",
            route: "#",
            permissionCode: ["dsh_usu_adm", "dsh_rol_adm", "dsh_log_adm"],
          },
        ],
      },
      {
        icon: <LuMonitor color="white" />,
        label: "Gestión de personal",
        route: "#",
        children: [
          {
            label: "Empleados",
            route: "/area-administrativa/personal",
            permissionCode: [],
          },
          {
            label: "Reportes",
            route: "#",
            permissionCode: [],
          },
        ],
      },
      {
        icon: <LuBookOpen color="white" />,
        label: "Gestión de tratamientos",
        route: "#",
        children: [
          {
            label: "Tratamientos asignados",
            route: "/area-administrativa/tratamientos",
            permissionCode: ["dsh_trs_adm"],
          },
          {
            label: "Tipos de tratamiento",
            route: "/area-administrativa/tipos-de-tratamiento",
            permissionCode: ["dsh_ttrs_adm"],
          },
          {
            label: "Reportes",
            route: "#",
            permissionCode: ["dsh_trs_adm", "dsh_ttrs_adm"],
          },
        ],
      },
      {
        icon: <LuCreditCard color="white" />,
        label: "Gestión de deudas",
        route: "#",
        children: [
          {
            label: "Panel de deudas",
            route: "/area-administrativa/deudas",
            permissionCode: [],
          },
        ],
      },
      {
        icon: <LuCog color="white" />,
        label: "Configuración",
        route: "#",
        children: [
          {
            label: "Importar datos",
            route: "/area-administrativa/configuracion",
            permissionCode: [],
          },
        ],
      },
    ],
  },
];
