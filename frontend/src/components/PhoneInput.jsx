import "../styles/phone-input.css";

export default function PhoneInput({ value, onChange, countryCode, onCountryCodeChange, className }) {
  return (
    <div className="phone-input-group">
      <select aria-label="Country code" className={className} value={countryCode} onChange={(event) => onCountryCodeChange(event.target.value)}>
        <option value="+91">India +91</option>
        <option value="+1">US/Canada +1</option>
        <option value="+44">UK +44</option>
        <option value="+61">Australia +61</option>
      </select>
      <input aria-label="Mobile number" className={className} type="tel" inputMode="numeric"
        autoComplete="tel-national" placeholder="10-digit mobile number" required
        pattern="[0-9]{10}" maxLength={10} title="Enter exactly 10 digits"
        value={value} onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 10))} />
    </div>
  );
}
