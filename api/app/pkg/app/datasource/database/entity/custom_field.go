package entity

import "github.com/google/uuid"

type CustomField struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Type  string    `json:"type"`
	Value string    `json:"value"`
}

type CustomFieldValue struct {
	ID    uuid.UUID `json:"id"`
	Value string    `json:"value"`
}
