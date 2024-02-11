import React, { FC } from "react";
import classes from "./CreateArticle.module.scss";
import Header from "../Header/Header";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hook";
import { createArticle } from "../Store/ArticleSlice";
import { useNavigate } from "react-router-dom";

type FormFields = {
  title: string;
  description: string;
  text: string;
  tags: {
    name: "";
  }[];
};

const CreateArticle: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<FormFields>({
    defaultValues: {
      title: "",
      description: "",
      text: "",
      tags: [{ name: "" }],
    },
  });
  const key = localStorage.getItem("token")!;
  const error = useAppSelector((state) => state.articles.errorCreate);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control,
  });

  const onSubmit: SubmitHandler<FormFields> = async ({
    title,
    description,
    text,
    tags,
  }) => {
    try {
      let tagss: string[] = tags.map((el) => el.name);
      await dispatch(
        createArticle({ title, description, text, tags: tagss, key })
      );
      if (error === true) {
        throw new Error();
      }
      navigate("/articles");
    } catch (error) {
      setError("root", {
        message: "Something went wrong",
      });
    }
  };

  return (
    <React.Fragment>
      <Header />
      <form className={classes.formCreate} onSubmit={handleSubmit(onSubmit)}>
        <h2>Create new article</h2>
        <div className={classes.innerInput}>
          <h3>Title</h3>
          <input
            placeholder="Title"
            type="text"
            {...register("title", {
              required: "Title is required",
            })}
          />
          {errors.title && (
            <div style={{ color: "red" }}>{errors.title.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Short description</h3>
          <input
            placeholder="Short description"
            type="text"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <div style={{ color: "red" }}>{errors.description.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Text</h3>
          <textarea
            placeholder="Text"
            className={classes.inputText}
            {...register("text", {
              required: "Text is required",
            })}
          />
          {errors.text && (
            <div style={{ color: "red" }}>{errors.text.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Tags</h3>
          {fields.map((field, index) => (
            <div className={classes.innerInputTag} key={field.id}>
              <input
                placeholder="Tag"
                type="text"
                {...register(`tags.${index}.name`)}
              />
              <button
                type="button"
                className={classes.delete}
                onClick={() => remove(index)}
              >
                Delete
              </button>
              <button
                type="button"
                className={classes.add}
                onClick={() =>
                  append({
                    name: "",
                  })
                }
              >
                Add tag
              </button>
            </div>
          ))}
        </div>
        <button type="submit">Send</button>
      </form>
    </React.Fragment>
  );
};

export default CreateArticle;
