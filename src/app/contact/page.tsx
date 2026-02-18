import { getContactSettings } from "@/lib/data";
import ContactContent from "./ContactContent";

export default async function ContactPage() {
  const contact = await getContactSettings();
  return <ContactContent contact={contact} />;
}
