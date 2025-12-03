"use client";
import {
  RadioGroup,
  Stack,
  Input,
  Fieldset,
  Text,
  Field,
} from "@chakra-ui/react";

type Props = {
  costValue: number;
  onCostChange: (value: number) => void;
  discountValue: number;
  onDiscountChange: (value: number) => void;
};

export function DiscountSection({
  costValue,
  onCostChange,
  discountValue,
  onDiscountChange,
}: Props) {
  const discounts = [0, 10, 50, 80, 100];
  const numericCost = Number(costValue) || 0;
  const numericDiscount = Number(discountValue);
  const total = numericCost - numericCost * (numericDiscount / 100);

  return (
    <Fieldset.Root
      size="lg"
      w="100%"
      className="flex flex-row flex-wrap items-start gap-2 px-2 mb-2"
    >
      <Field.Root className="flex-1 min-w-[80px] flex flex-col justify-center">
        <Field.Label className="mb-0 text-sm">Costo</Field.Label>
        <Input
          type="number"
          placeholder="250.00"
          value={costValue}
          onChange={(e) => onCostChange(Number(e.target.value))}
          size="sm"
          className="py-1 text-sm"
        />
      </Field.Root>
      <Field.Root className="flex-1 min-w-[80px] flex flex-col justify-center mt-0">
        <Field.Label className="mb-0 text-sm">Descuento</Field.Label>
        <RadioGroup.Root
          value={discountValue.toString()}
          onValueChange={(e) => onDiscountChange(Number(e.value))}
        >
          <Stack
            direction="row"
            gap="1"
            wrap="wrap"
            className="justify-start items-center"
          >
            {discounts.map((d) => (
              <RadioGroup.Item key={d} value={d.toString()}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText className="text-xs">
                  {d}%
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </Stack>
        </RadioGroup.Root>
      </Field.Root>
      <div className="flex-shrink-0 flex flex-col justify-center items-center min-w-[60px] mt-0">
        <Field.Root>
          <Field.Label className="mb-0 text-sm">Total</Field.Label>
          <Text fontWeight="semibold" fontSize="sm">
            {isNaN(total) ? "0.00" : total.toFixed(2)}
          </Text>
        </Field.Root>
      </div>
    </Fieldset.Root>
  );
}
