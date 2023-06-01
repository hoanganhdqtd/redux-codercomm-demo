import { useFormContext, Controller } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";

function FRadioGroup({ name, options, getOptionLabel, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <RadioGroup {...field} row {...other}>
            {options.map((option, index) => (
              <FormControlLabel
                key={option}
                value={option}
                control={<Radio />}
                label={getOptionLabel?.length ? getOptionLabel[index] : option}
              />
            ))}

            {!!error && (
              <FormHelperText error sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
          </RadioGroup>
        </div>
      )}
      {...other}
    />
  );
}

export default FRadioGroup;
