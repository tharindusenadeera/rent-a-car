export const postGtag = (value, transaction_id) => {
  window.gtag("event", "conversion", {
    send_to: "AW-823189734/Rq_iCMOzmJUBEObBw4gD",
    value,
    currency: "USD",
    transaction_id
  });
  return false;
};
