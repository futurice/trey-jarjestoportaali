import { Container } from "@radix-ui/themes"
import { ApplicationForm } from "./ApplicationForm/ApplicationForm"

const Dashboard = () => {
  return (
    <Container align="center">
      <h1>Luo hakemus</h1>
      <ApplicationForm />
    </Container>
  )
}

export default Dashboard
