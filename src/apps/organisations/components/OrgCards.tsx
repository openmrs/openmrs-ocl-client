import React from "react";
import { Grid, Typography, Box } from "@material-ui/core";
  
import OrganisationCard from "./OrgCard";
export interface Card {
  name: string
  url: string
  id: string
}
interface Props {
  cards: Card[]
  title: string
}

const OrganisationCards: React.FC<Props> = ({ cards, title }) => { 
  return (
    <Box width="100%" p={4} mb="2rem">
      <Grid item xs={12} container spacing={2} justify='center' data-testid='cards'>
      {cards.length === 0 ? (
        <Typography component='span' variant='h6' data-testid='noCards'>
            No {title}
        </Typography>
      ) : (
        ""
      )}
      {cards.map(({name, url, id}, index) => (
        <OrganisationCard
            key={`${id}-${index}`}
            name={name}
            url={url}
            id={id}
            index={index}
        />
      ))}
      </Grid>
    </Box>
  );
};


export default OrganisationCards;
