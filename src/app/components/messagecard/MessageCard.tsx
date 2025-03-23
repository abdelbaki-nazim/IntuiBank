"use client";

import React, { memo, useCallback } from "react";
import {
  Card,
  CardTitle,
  CardBody,
  CardActions,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";

interface MessageCardProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  type?: "default" | "primary" | "info" | "success" | "warning" | "error";
}

const MessageCardComponent: React.FC<MessageCardProps> = ({
  title,
  message,
  buttonText,
  onButtonClick,
  type = "default",
}) => {
  const handleClick = useCallback(() => {
    onButtonClick();
  }, [onButtonClick]);

  return (
    <Card style={{ width: 300 }} type={type}>
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <p>{message}</p>
      </CardBody>
      <CardActions>
        <Button
          type="button"
          themeColor={type === "default" ? "primary" : type}
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

export const MessageCard = memo(MessageCardComponent);
