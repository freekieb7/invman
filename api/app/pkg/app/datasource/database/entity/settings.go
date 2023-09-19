package entity

type Settings struct {
	Attributes SettingsAttributes
}

type SettingsAttributes struct {
	ItemFields []CustomField `json:"fields,omitempty"`
}
