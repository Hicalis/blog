import React, { FC, useEffect } from "react";
import Header from "../Header/Header";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hook";
import { editArticle, getArticleBySlug } from "../Store/ArticleSlice";
import classes from "./EditArticle.module.scss";
import { useNavigate } from "react-router-dom";

type FormFields = {
  title: string;
  description: string;
  text: string;
  tags: {
    name: string;
  }[];
};

const EditArticle: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("isLogged") === "false") {
      navigate("/sign-in");
    }

    async function asd() {
      dispatch(
        getArticleBySlug({
          slug: localStorage.getItem("slug")!,
          key: localStorage.getItem("token")!,
        })
      );
    }
    asd();
  }, []);

  const article = useAppSelector((state) => state.articles.article);
  let obj1: { name: string }[] = [];

  for (const name of JSON.parse(localStorage.getItem("tags")!)) {
    obj1.push({ name });
  }

  if (!obj1.length) {
    obj1.push({ name: "" });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<FormFields>({
    defaultValues: {
      title: article?.title,
      description: article?.description,
      text: article?.body,
      tags: obj1,
    },
  });
  const key = localStorage.getItem("token")!;
  const error = useAppSelector((state) => state.articles.errorCreate);
  const slug = article?.slug!;
  const { fields, append, remove } = useFieldArray({
    name: "tags",
    control,
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async ({
    title,
    description,
    text,
    tags,
  }) => {
    try {
      let tagss: string[] = tags.map((el) => el.name);
      await dispatch(
        editArticle({ title, description, text, tags: tagss, key, slug })
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
        <h2>Edit article</h2>
        <div className={classes.innerInput}>
          <h3>Title</h3>
          <input
            defaultValue={article?.title}
            placeholder="Title"
            type="text"
            {...register("title", {
              required: "Title is required",
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/,
                message:
                  "Entered value cant start/end or contain only white spacing",
              },
            })}
          />
          {errors.title && (
            <div style={{ color: "red" }}>{errors.title.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Short description</h3>
          <input
            defaultValue={article?.description}
            placeholder="Short description"
            type="text"
            {...register("description", {
              required: "Description is required",
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/,
                message:
                  "Entered value cant start/end or contain only white spacing",
              },
            })}
          />
          {errors.description && (
            <div style={{ color: "red" }}>{errors.description.message}</div>
          )}
        </div>
        <div className={classes.innerInput}>
          <h3>Text</h3>
          <textarea
            defaultValue={article?.body}
            placeholder="Text"
            className={classes.inputText}
            {...register("text", {
              required: "Text is required",
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/,
                message:
                  "Entered value cant start/end or contain only white spacing",
              },
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
                {...register(`tags.${index}.name`, {
                  pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/,
                    message:
                      "Entered value cant start/end or contain only white spacing",
                  },
                })}
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

export default EditArticle;
