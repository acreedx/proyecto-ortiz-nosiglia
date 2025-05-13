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
export const menuOptions = [
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
          },
          {
            label: "Organizaciones",
            route: "/area-administrativa/organizaciones",
          },
          {
            label: "Reportes",
            route: "/area-administrativa/reportes",
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
          },
          {
            label: "Reportes",
            route: "#",
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
          },
          {
            label: "Roles",
            route: "/area-administrativa/roles",
          },
          {
            label: "Eventos del sistema",
            route: "/area-administrativa/eventos-del-sistema",
          },
          {
            label: "Reportes",
            route: "#",
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
          },
          {
            label: "Reportes",
            route: "#",
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
          },
          {
            label: "Tipos de tratamiento",
            route: "/area-administrativa/tipos-de-tratamiento",
          },
          {
            label: "Reportes",
            route: "#",
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
          },
        ],
      },
    ],
  },
];
