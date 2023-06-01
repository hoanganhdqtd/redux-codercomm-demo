import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, Stack, alpha } from "@mui/material";
import { FTextField, FUploadImage, FormProvider } from "../../components/form";
import { LoadingButton } from "@mui/lab";

import { editPost } from "./postSlice";

const yupSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const defaultValues = {
  content: "",
  // image: null,
  image: "",
};

function PostEditForm({ post, setIsPostEdit }) {
  const { isLoading } = useSelector((state) => state.post);

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const dispatch = useDispatch();

  // preview: URL.createObjectURL(file)
  // to see image preview with file.preview
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // const handleFile = (e) => {
  //   // console.log(fileInput.current.files[0]);
  //   // put "image" field to the form to submit
  //   const file = fileInput.current.files[0];
  //   if (file) {
  //     setValue("image", file);
  //   }
  // };

  const onSubmit = (data) => {
    // console.log("data", data);
    setIsPostEdit(false);
    dispatch(editPost({ ...data, postId: post._id })).then(() => reset());
  };

  // file as input type to upload image
  // <input type="file" ref={fileInput} onChange={handleFile} />
  // <input type="file" />: read-only => cannot use 2 way
  // control => use useRef

  // const fileInput = useRef();

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FTextField
            name="content"
            multiline
            fullWidth
            rows={4}
            placeholder="Edit your post here..."
            sx={{
              "& fieldset": {
                borderWidth: `1px !important`,
                borderColor: alpha("#919EAB", 0.32),
              },
            }}
          />

          {/* <FTextField name="image" placeholder="image" /> */}
          {/* <input type="file" ref={fileInput} onChange={handleFile} /> */}

          <FUploadImage
            name="image"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Box sx={{ mx: 1 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                size="small"
                loading={isSubmitting || isLoading}
              >
                Edit
              </LoadingButton>
            </Box>
            <Box sx={{ mx: 1 }}>
              <LoadingButton
                variant="contained"
                size="small"
                onClick={() => {
                  setIsPostEdit(false);
                }}
              >
                Cancel
              </LoadingButton>
            </Box>
          </Box>
        </Stack>
      </FormProvider>
    </Card>
  );
}

export default PostEditForm;
