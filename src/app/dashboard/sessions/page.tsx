"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardActions,
  CardFooter,
  CardImage,
} from "@progress/kendo-react-layout";
import { Typography } from "@progress/kendo-react-common";
import { Button } from "@progress/kendo-react-buttons";
import ReactConfetti from "react-confetti";

const Sessions: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleLearnMore = () => {
    setShowConfetti(true);

    setTimeout(() => {
      setShowThankYou(true);
    }, 5000);
  };

  const handleCancelThankYou = () => {
    setShowThankYou(false);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          margin: "0 auto",
          padding: "16px",
          position: "relative",
        }}
      >
        <Card>
          <CardHeader>
            <div style={{ textAlign: "center" }}>
              <CardImage
                src="/construction.png"
                alt="Session Banner"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  margin: "0 auto",
                }}
              />
            </div>
            <CardTitle>Session Journal</CardTitle>
            <CardSubtitle>Under Construction</CardSubtitle>
          </CardHeader>
          <CardBody>
            <Typography.p>
              This section is currently under construction. Please check back
              later for more details.
            </Typography.p>
          </CardBody>
          <CardActions layout="center">
            <Button themeColor="primary" onClick={handleLearnMore}>
              Learn More
            </Button>
          </CardActions>
          <CardFooter>
            <Typography.p>© {new Date().getFullYear()} IntuiBank.</Typography.p>
          </CardFooter>
        </Card>
      </div>

      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={4000}
        />
      )}

      {showThankYou && (
        <div style={{ position: "fixed", bottom: 20, right: 20 }}>
          <Card style={{ width: 250 }} type="info">
            <CardHeader>
              <CardTitle>Thank You!</CardTitle>
              <CardSubtitle>Your support matters.</CardSubtitle>
            </CardHeader>
            <CardBody>
              <Typography.p>
                I appreciate your continued support. Thank you for being with
                me!
              </Typography.p>
            </CardBody>
            <CardActions>
              <Button themeColor="primary" onClick={handleCancelThankYou}>
                Cancel
              </Button>
            </CardActions>
          </Card>
        </div>
      )}
    </>
  );
};

export default Sessions;
