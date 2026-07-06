import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";

import type {
  Resume,
  ResumeBasics,
  ResumeEducationEntry,
  ResumeWorkEntry,
} from "./types.js";

/** Roles rendered with a summary; the rest become one-liners. */
const DETAILED_ROLE_COUNT = 4;
const RESUME_JSON_URL = "https://douglasmoura.dev/resume.json";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const listFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const styles = StyleSheet.create({
  compactEntry: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  contact: {
    marginTop: 6,
  },
  contactRow: {
    color: "#444444",
    fontSize: 9,
    lineHeight: 1.5,
  },
  entry: {
    marginBottom: 7,
  },
  entryHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  entryMeta: {
    color: "#555555",
    fontSize: 9,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
  },
  footer: {
    borderTopColor: "#999999",
    borderTopWidth: 0.75,
    bottom: 36,
    color: "#555555",
    fontSize: 8.5,
    left: 48,
    paddingTop: 6,
    position: "absolute",
    right: 48,
    textAlign: "center",
  },
  footerLink: {
    color: "#555555",
  },
  header: {
    marginBottom: 14,
  },
  label: {
    color: "#444444",
    fontSize: 11,
    lineHeight: 1.3,
    marginTop: 2,
  },
  link: {
    color: "#444444",
    textDecoration: "none",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    lineHeight: 1.15,
  },
  page: {
    color: "#111111",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.4,
    paddingBottom: 64,
    paddingHorizontal: 48,
    paddingTop: 42,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    borderBottomColor: "#999999",
    borderBottomWidth: 0.75,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 3,
    textTransform: "uppercase",
  },
  skillName: {
    fontFamily: "Helvetica-Bold",
  },
  skillRow: {
    marginBottom: 3,
  },
});

const formatDate = (date?: string): string => {
  if (!date) {
    return "Present";
  }
  const [year, month] = date.split("-");
  if (!month) {
    return year;
  }
  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
};

const formatRange = (startDate: string, endDate?: string): string =>
  `${formatDate(startDate)} – ${formatDate(endDate)}`;

const stripProtocol = (url: string): string =>
  url.replace(/^https?:\/\//u, "").replace(/\/$/u, "");

const formatLocation = (basics: ResumeBasics): string | undefined => {
  const { location } = basics;
  if (!location?.city) {
    return;
  }
  const country = location.countryCode
    ? regionNames.of(location.countryCode)
    : undefined;
  return country ? `${location.city}, ${country}` : location.city;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ContactRow = ({
  parts,
}: {
  parts: { key: string; node: ReactNode }[];
}) => (
  <Text style={styles.contactRow}>
    {parts.map((part, index) => (
      <Text key={part.key}>
        {index > 0 && "  ·  "}
        {part.node}
      </Text>
    ))}
  </Text>
);

const Header = ({ basics }: { basics: ResumeBasics }) => {
  // Two deliberate contact lines: basics first, profiles second —
  // a single line wraps unpredictably and leaves dangling separators.
  const contactParts: { key: string; node: ReactNode }[] = [];
  const location = formatLocation(basics);
  if (location) {
    contactParts.push({ key: "location", node: location });
  }
  contactParts.push(
    {
      key: "email",
      node: (
        <Link href={`mailto:${basics.email}`} style={styles.link}>
          {basics.email}
        </Link>
      ),
    },
    {
      key: "url",
      node: (
        <Link href={basics.url} style={styles.link}>
          {stripProtocol(basics.url)}
        </Link>
      ),
    }
  );

  const profileParts = (basics.profiles ?? []).map((profile) => ({
    key: profile.network,
    node: (
      <Link href={profile.url} style={styles.link}>
        {stripProtocol(profile.url)}
      </Link>
    ),
  }));

  return (
    <View style={styles.header}>
      <Text style={styles.name}>{basics.name}</Text>
      <Text style={styles.label}>{basics.label}</Text>
      <View style={styles.contact}>
        <ContactRow parts={contactParts} />
        {profileParts.length > 0 && <ContactRow parts={profileParts} />}
      </View>
    </View>
  );
};

const DetailedWorkItem = ({ entry }: { entry: ResumeWorkEntry }) => (
  <View style={styles.entry}>
    <View style={styles.entryHeader}>
      <Text style={styles.entryTitle}>
        {entry.position} · {entry.name}
      </Text>
      <Text style={styles.entryMeta}>
        {formatRange(entry.startDate, entry.endDate)}
      </Text>
    </View>
    {entry.summary && <Text>{entry.summary}</Text>}
  </View>
);

const CompactWorkItem = ({ entry }: { entry: ResumeWorkEntry }) => (
  <View style={styles.compactEntry}>
    <Text>
      <Text style={styles.skillName}>{entry.position}</Text> · {entry.name}
    </Text>
    <Text style={styles.entryMeta}>
      {formatRange(entry.startDate, entry.endDate)}
    </Text>
  </View>
);

const EducationItem = ({ entry }: { entry: ResumeEducationEntry }) => (
  <View style={styles.compactEntry}>
    <Text>
      <Text style={styles.skillName}>
        {entry.studyType} in {entry.area}
      </Text>
      {" · "}
      {entry.institution}
    </Text>
    <Text style={styles.entryMeta}>
      {formatRange(entry.startDate, entry.endDate)}
    </Text>
  </View>
);

const Footer = () => (
  <View fixed style={styles.footer}>
    <Text>
      This résumé is intentionally one page. The complete, machine-readable
      record (containing every role, highlight, talk, and open-source projects)
      lives at{" "}
      <Link href={RESUME_JSON_URL} style={styles.footerLink}>
        {stripProtocol(RESUME_JSON_URL)}
      </Link>
      . Feed it to your favorite LLM and ask away.
    </Text>
  </View>
);

export const ResumeDocument = ({ resume }: { resume: Resume }) => {
  const detailedRoles = resume.work.slice(0, DETAILED_ROLE_COUNT);
  const earlierRoles = resume.work
    .slice(DETAILED_ROLE_COUNT)
    .toSorted((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <Document
      author={resume.basics.name}
      subject={resume.basics.label}
      title={`${resume.basics.name} — Resume`}
    >
      <Page size="A4" style={styles.page}>
        <Header basics={resume.basics} />

        <Section title="Summary">
          <Text>{resume.basics.summary}</Text>
        </Section>

        <Section title="Experience">
          {detailedRoles.map((entry) => (
            <DetailedWorkItem
              entry={entry}
              key={`${entry.name}-${entry.startDate}`}
            />
          ))}
          {earlierRoles.map((entry) => (
            <CompactWorkItem
              entry={entry}
              key={`${entry.name}-${entry.startDate}`}
            />
          ))}
        </Section>

        {resume.skills && resume.skills.length > 0 && (
          <Section title="Skills">
            {resume.skills.map((skill) => (
              <Text key={skill.name} style={styles.skillRow}>
                <Text style={styles.skillName}>{skill.name}: </Text>
                {listFormatter.format(skill.keywords)}.
              </Text>
            ))}
            {resume.languages && resume.languages.length > 0 && (
              <Text style={styles.skillRow}>
                <Text style={styles.skillName}>Languages: </Text>
                {listFormatter.format(
                  resume.languages.map(
                    (lang) => `${lang.language} (${lang.fluency})`
                  )
                )}
                .
              </Text>
            )}
          </Section>
        )}

        {resume.education && resume.education.length > 0 && (
          <Section title="Education">
            {resume.education.map((entry) => (
              <EducationItem
                entry={entry}
                key={`${entry.institution}-${entry.startDate}`}
              />
            ))}
          </Section>
        )}

        <Footer />
      </Page>
    </Document>
  );
};
