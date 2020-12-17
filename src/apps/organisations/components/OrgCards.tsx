import React from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import OrganisationCard from "./OrgCard";

export interface Card {
  name: string;
  url: string;
  id: string;
}

interface Props {
  cards: Card[];
  title: string;
}

const OrganisationCards: React.FC<Props> = ({ cards, title }) => {
  return (
      <Box width="100%" p={4}>
          <Grid item xs={12} container spacing={2} justify='center' data-testid='cards'>
              {cards.length === 0 ? (
                  <Typography component='span' variant='h6' data-testid='noCards'>
                      No {title}
                  </Typography>
              ) : (
                  ""
              )}
              {cards.map(({name, url, id},index) => (
                      <OrganisationCard
                          key={index}
                          name={name}
                          url={url}
                          index={index}
                          id={id}
                      />
                  )
              )}
          </Grid>
      </Box>
  );
};

export default OrganisationCards;
