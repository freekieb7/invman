package redis

import (
	"context"
	"fmt"
	"invman/auth/internal/app/config"
	"time"

	"github.com/go-redis/redis/v8"
)

const (
	ErrNotFound = redis.Nil
)

type Redis struct {
	client *redis.Client
}

func New(config config.RedisConfig) *Redis {
	return &Redis{
		client: redis.NewClient(&redis.Options{
			Addr:     fmt.Sprintf("%s:%d", config.Host, config.Port),
			Password: config.Password,
			DB:       int(config.DbNumber),
		}),
	}
}

func (redis *Redis) Get(key string) (value string, err error) {
	return redis.client.Get(context.Background(), key).Result()
}

func (redis *Redis) Set(key string, value string, ttl time.Duration) error {
	return redis.client.Set(context.Background(), key, value, ttl).Err()
}

func (redis *Redis) Delete(key string) error {
	return redis.client.Del(context.Background(), key).Err()
}
