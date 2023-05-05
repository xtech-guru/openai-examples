'use client'

import { useAsyncFn } from 'react-use'
import {
  List,
  ListItem,
  Button,
  Progress,
  Stack,
  Card,
  CardBody,
  Text,
  ListIcon
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons';

export const SurveysGeneration = () => {
  const [state, doFetch] = useAsyncFn(async () => {
    const response = await fetch('/api/open-ai');
    const result = await response.json();
    return result
  }, []);

  const handleClick = () => {
    doFetch();
  }

  return (
    <div className="m-12">
      {
        (() => {
          if (state.loading) {
            return (
              <Stack spacing={5}>
                <Progress colorScheme='green' isIndeterminate height="32px" />
                <Progress colorScheme='green' isIndeterminate height="32px" />
                <Progress colorScheme='green' isIndeterminate height="32px" />
                <Progress colorScheme='green' isIndeterminate height="32px" />
                <Progress colorScheme='green' isIndeterminate height="32px" />
              </Stack>
            )
          } else if (state.value && Array.isArray(state.value)) {
            return (
              <SurveysList surveys={state.value} />
            )
          } else {
            return (
              <Button onClick={handleClick} colorScheme='teal' variant="outline">
                Generate Surveys
              </Button>
            )
          }
        })()
      }
    </div>
  );
}

function SurveysList({ surveys }: { surveys: string[] }) {
  return (
    <List spacing={3}>
      {surveys.map((survey) => (
        <SurveysListItem key={survey} survey={survey} />
      ))}
    </List>
  )
}

function SurveysListItem({ survey }: { survey: string }) {
  const [state, doFetch] = useAsyncFn(async (data) => {
    const response = await fetch('/api/open-ai', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result
  }, []);
  function handleOnClick() {
    doFetch({ question: survey })
  }
  return (
    <ListItem>
      <Card>
        <CardBody>
          <Text>{survey}</Text>
          {!state.value && (
            <Button
              variant="outline"
              colorScheme='teal'
              onClick={handleOnClick}>
              Generate Answers
            </Button>
          )}
          {state.loading && (
            <Stack spacing={3}>
              <Progress colorScheme='green' isIndeterminate />
              <Progress colorScheme='green' isIndeterminate />
              <Progress colorScheme='green' isIndeterminate />
            </Stack>
          )}
          {state.value && state.value.map((item: string) => (
            <List spacing={3} key={item}>
              <ListItem>
                <ListIcon as={InfoOutlineIcon} color='green.500' />
                {item}
              </ListItem>
            </List>
          ))}
        </CardBody>
      </Card>
    </ListItem>
  )
}