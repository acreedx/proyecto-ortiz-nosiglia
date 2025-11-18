"use client";
import { useForm } from "react-hook-form";
import {
  mostrarAlertaConfirmacion,
  mostrarAlertaError,
  mostrarAlertaExito,
} from "../../../../../lib/sweetalert/alerts";
import { updateConfiguration } from "../actions/operations";
import { horaAFechaUTC } from "../../../../../hooks/utils";
import {
  CardHeader,
  Heading,
  CardBody,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Input,
  Text,
  Field,
} from "@chakra-ui/react";

type Props = {
  configuraciones: {
    openHour: Date | null;
    closeHour: Date | null;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
};

type FormValues = {
  openHour: string;
  closeHour: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export default function EditConfigurationForm({ configuraciones }: Props) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      openHour: configuraciones.openHour
        ? configuraciones.openHour.toISOString().substring(11, 16)
        : "",
      closeHour: configuraciones.closeHour
        ? configuraciones.closeHour.toISOString().substring(11, 16)
        : "",
      monday: configuraciones.monday,
      tuesday: configuraciones.tuesday,
      wednesday: configuraciones.wednesday,
      thursday: configuraciones.thursday,
      friday: configuraciones.friday,
      saturday: configuraciones.saturday,
      sunday: configuraciones.sunday,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de editar la configuración?",
    });
    if (isConfirmed) {
      const payload = {
        openHour: horaAFechaUTC(data.openHour),
        closeHour: horaAFechaUTC(data.closeHour),
        monday: !!data.monday,
        tuesday: !!data.tuesday,
        wednesday: !!data.wednesday,
        thursday: !!data.thursday,
        friday: !!data.friday,
        saturday: !!data.saturday,
        sunday: !!data.sunday,
      };
      const res = await updateConfiguration(payload);
      if (res.ok) {
        mostrarAlertaExito({
          mensaje: "Éxito al editar la configuración",
        });
      } else {
        mostrarAlertaError({
          mensaje: res.message
            ? res.message
            : "Error al editar la configuración",
        });
      }
    }
  };

  return (
    <Card.Root
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={4}
      rounded="2xl"
      borderWidth="1px"
      bg="white"
      mt={4}
      shadow="sm"
      _dark={{
        bg: "rgb(36 48 63 / var(--tw-bg-opacity, 1))",
      }}
    >
      <CardHeader>
        <Heading size="md">Editar configuración</Heading>
      </CardHeader>

      <CardBody display="flex" flexDirection="column" gap={6}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Field.Root>
            <Field.Label>Hora de apertura</Field.Label>
            <Input type="time" {...register("openHour")} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Hora de cierre</Field.Label>
            <Input type="time" {...register("closeHour")} />
          </Field.Root>
        </Grid>

        <Box>
          <Text fontWeight="medium" mb={2}>
            Días de atención
          </Text>
          <Flex gap={4} wrap="wrap" overflowX="auto" align="center">
            <Checkbox.Root
              colorPalette={"orange"}
              {...register("monday")}
              defaultChecked={configuraciones.monday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Lunes</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              colorPalette={"orange"}
              {...register("tuesday")}
              defaultChecked={configuraciones.tuesday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Martes</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              colorPalette={"orange"}
              {...register("wednesday")}
              defaultChecked={configuraciones.wednesday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Miércoles</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              colorPalette={"orange"}
              {...register("thursday")}
              defaultChecked={configuraciones.thursday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Jueves</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              colorPalette={"orange"}
              {...register("friday")}
              defaultChecked={configuraciones.friday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Viernes</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              colorPalette={"orange"}
              {...register("saturday")}
              defaultChecked={configuraciones.saturday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Sábado</Checkbox.Label>
            </Checkbox.Root>

            <Checkbox.Root
              colorPalette={"orange"}
              {...register("sunday")}
              defaultChecked={configuraciones.sunday}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Indicator>✓</Checkbox.Indicator>
              <Checkbox.Label>Domingo</Checkbox.Label>
            </Checkbox.Root>
          </Flex>
        </Box>

        <Flex justify={{ base: "center", sm: "end" }}>
          <Button type="submit" colorPalette={"orange"}>
            Guardar cambios
          </Button>
        </Flex>
      </CardBody>
    </Card.Root>
  );
}
