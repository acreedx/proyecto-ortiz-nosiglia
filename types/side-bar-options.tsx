import PatientIcon from "../components/icons/patient-icon";

export const menuOptions = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <PatientIcon />,
        label: "Dashboard",
        route: "#",
        children: [
          {
            label: "Panel de control",
            route: "#",
          },
          {
            label: "Sitio Web",
            route: "#",
          },
        ],
      },
      {
        icon: <PatientIcon />,
        label: "Gestión de pacientes",
        route: "#",
        children: [
          {
            label: "Pacientes",
            route: "#",
          },
          {
            label: "Organizaciones",
            route: "#",
          },
          {
            label: "Reportes",
            route: "#",
          },
        ],
      },
      {
        icon: <PatientIcon />,
        label: "Gestión de citas",
        route: "#",
        children: [
          {
            label: "Citas",
            route: "#",
          },
          {
            label: "Reportes",
            route: "#",
          },
        ],
      },
      {
        icon: <PatientIcon />,
        label: "Gestión de usuarios",
        route: "#",
        children: [
          {
            label: "Usuarios",
            route: "#",
          },
          {
            label: "Roles",
            route: "#",
          },
          {
            label: "Eventos del sistema",
            route: "#",
          },
          {
            label: "Reportes",
            route: "#",
          },
        ],
      },
      {
        icon: <PatientIcon />,
        label: "Gestión de Tratamientos",
        route: "#",
        children: [
          {
            label: "Listado de tratamientos",
            route: "#",
          },
          {
            label: "Tipos de tratamiento",
            route: "#",
          },
          {
            label: "Reportes",
            route: "#",
          },
        ],
      },
      {
        icon: <PatientIcon />,
        label: "Gestión de Deudas",
        route: "#",
        children: [
          {
            label: "Panel de deudas",
            route: "#",
          },
        ],
      },
      {
        icon: <PatientIcon />,
        label: "Configuración",
        route: "#",
        children: [
          {
            label: "Importar Datos",
            route: "#",
          },
        ],
      },
    ],
  },
];
