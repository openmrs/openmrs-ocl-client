import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import ContainerCard from "./ContainerCard";

export interface Card {
  name: string;
  short_code: string;
  owner: string;
  owner_type: string;
  description: string;
  url: string;
}

interface Props {
  cards: Card[];
  title: string;
}

const ContainerCards: React.FC<Props> = ({ cards, title }) => {
  return (
    <Box width="100%" p={4} paddingBottom={"4rem"}>
      <Grid
        item
        xs={12}
        container
        spacing={2}
        justifyContent="center"
        data-testid="cards"
      >
        {cards.length === 0 ? (
          <Typography component="span" variant="h6" data-testid="noCards">
            No {title}
          </Typography>
        ) : (
          ""
        )}
        {cards.map(
          (
            {
              name,
              short_code: shortCode,
              owner,
              owner_type: ownerType,
              description,
              url
            },
            index
          ) => (
            <ContainerCard
              key={index}
              name={name}
              short_code={shortCode}
              owner={owner}
              owner_type={ownerType}
              description={description}
              url={url}
              index={index}
            />
          )
        )}
      </Grid>
    </Box>
  );
};

export default ContainerCards;
