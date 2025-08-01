import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormData = {
  name: string;
  email: string;
  gender: string;
};

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  gender: z
    .enum(["male", "female"])
    .refine((val) => !!val, { message: "Gender is required" }),
});

export default function RHF() {
  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, isValid, errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form data", data);
  };

  return (
    <div className="container flex">
      <div className="content">
        <h1>React Hook Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              type="text"
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <Controller
              control={control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <select {...field}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              )}
            />

            {errors.gender && <p>{errors.gender.message}</p>}
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
