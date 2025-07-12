import { transporter } from "./transporter";
import { IBestellung } from "../model/BestellungModel";
import { User } from "../model/UserModel";

/* --------------------------------------------------------------------
 * Utility helpers
 * ------------------------------------------------------------------ */

/** Accepts boolean | string | number | null and returns true for
 *    values that semantically mean „true“ (true, "true", 1, "1"). */
const truthy = (v: any): boolean =>
  v === true || v === "true" || v === 1 || v === "1";

/** Coerce any price-like number to a formatted Euro string */
const fmt = (n: number) => `${n.toFixed(2)} €`;

/** Normalise and return all licence keys present on a product */
const extractKeys = (p: any): string[] => {
  if (Array.isArray(p.licenseKeys) && p.licenseKeys.length) return p.licenseKeys;
  if (typeof p.licenseKey === "string" && p.licenseKey.trim()) return [p.licenseKey];
  if (typeof p.key === "string" && p.key.trim()) return [p.key];
  return [];
};

export async function sendOrderConfirmationEmail(order: IBestellung) {
  /* 1. Digital / physisch ---------------------------------------------- */
  const hasDigital  = order.product.some(p => truthy(p.isDigital));
  const hasPhysical = order.product.some(p => !truthy(p.isDigital));

  /* 2. Blocks: Keys & Versandadresse ------------------------------------ */
  const keysHtml = hasDigital
    ? order.product
        .filter(p => truthy(p.isDigital))
        .map(p => {
          const keys = extractKeys(p);
          return `<p><strong>Ihr Key für „${p.name}”</strong><br>
                  ${keys.length ? keys.join("<br>") : "Wird separat zugesendet"}</p>`;
        })
        .join("")
    : "";

  const addressHtml = hasPhysical
    ? `<p><strong>Lieferadresse</strong><br>
         ${order.shippingAddress?.street}<br>
         ${order.shippingAddress?.zip} ${order.shippingAddress?.city}<br>
         ${order.shippingAddress?.country}
       </p>
       <p>Du erhältst eine weitere Mail, sobald dein Paket versendet wurde.</p>`
    : "";

  /** Kombiniert – Reihenfolge: Keys → Adresse */
  const dynamicHtml = `${keysHtml}${addressHtml}`;

  /* 3. Artikelliste ------------------------------------------------------ */
  const rows = order.product
    .map(
      p => `<tr>
              <td>${p.name}</td>
              <td align="center">${p.amount}</td>
              <td align="right">${fmt(p.price)}</td>
            </tr>`
    )
    .join("");

  const itemsTotal   = order.product.reduce((s, p) => s + p.price * p.amount, 0);
  const shippingCost = hasPhysical ? order.shippingCost ?? 0 : 0;
  const grandTotal   = itemsTotal + shippingCost;

  /* 4. Datum ------------------------------------------------------------- */
  const created = order.orderAt ?? new Date();

  /* 5. Empfänger-Mail ---------------------------------------------------- */
  const buyerMail =
    (order as any).email ??
    (await User.findById(order.userId).select("email"))!.email;

  /* 6. HTML-Mail --------------------------------------------------------- */
  const html = `
    <h2 style="margin-bottom:0">Vielen Dank für Ihre Bestellung #${order._id}</h2>
    <p style="margin-top:4px">Datum: ${created.toLocaleDateString("de-DE")}</p>

    ${dynamicHtml}

    <table width="100%" cellpadding="6" border="1"
           style="border-collapse:collapse;margin-top:12px">
      <thead style="background:#f2f2f2">
        <tr><th align="left">Spiel</th><th align="center">Menge</th><th align="right">Preis</th></tr>
      </thead>
      <tbody>
        ${rows}
        ${
          shippingCost
            ? `<tr>
                 <td colspan="2" align="right">Versand (${order.shippingProvider})</td>
                 <td align="right">${fmt(shippingCost)}</td>
               </tr>`
            : ""
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" align="right"><strong>Gesamtsumme</strong></td>
          <td align="right"><strong>${fmt(grandTotal)}</strong></td>
        </tr>
      </tfoot>
    </table>

    <p style="margin-top:20px">Bei Fragen antworte einfach auf diese Mail.</p>
  `;

  /* 7. Text-Fallback ----------------------------------------------------- */
  const textParts: string[] = [
    `Vielen Dank für Ihre Bestellung #${order._id}!`,
    ""
  ];

  if (hasDigital) {
    order.product
      .filter(p => truthy(p.isDigital))
      .forEach(p => {
        const keys = extractKeys(p);
        textParts.push(
          `Key(s) für ${p.name}: ${keys.length ? keys.join(", ") : "folgt separat"}`
        );
      });
    textParts.push("");
  }

  if (hasPhysical) {
    textParts.push(
      `Wir versenden an: ${order.shippingAddress?.street}, ` +
      `${order.shippingAddress?.zip} ${order.shippingAddress?.city}, ` +
      `${order.shippingAddress?.country}`,
      ""
    );
  }

  textParts.push(
    "Bestellte Artikel:",
    ...order.product.map(p => `• ${p.name} x${p.amount} — ${fmt(p.price)}`)
  );

  if (shippingCost) {
    textParts.push(`Versand: ${fmt(shippingCost)}`);
  }

  textParts.push("", `Gesamtsumme: ${fmt(grandTotal)}`);

  const text = textParts.join("\n");

  /* 8. Mail raus --------------------------------------------------------- */
  return transporter.sendMail({
    from: `"GameCompass" <${process.env.SMTP_USER}>`,
    to:   buyerMail,
    subject: `Bestellbestätigung #${order._id}`,
    html,
    text,
  });
}
