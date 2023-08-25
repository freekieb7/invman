package redis

import (
	"context"
	"fmt"
	"invman/auth/internal/app/config"
	"time"

	"github.com/go-redis/redis/v8"
)

type Redis struct {
	client *redis.Client
}

func New(cnf *config.RedisConfig) *Redis {
	return &Redis{
		client: redis.NewClient(&redis.Options{
			Addr:     fmt.Sprintf("%s:%d", cnf.Host, cnf.Port),
			Password: cnf.Password,
			DB:       int(cnf.DbNumber),
		}),
	}
}

func (r *Redis) Get(key string) (value string, err error) {
	return r.client.Get(context.Background(), key).Result()
}

func (r *Redis) Set(key string, value string, ttl time.Duration) error {
	return r.client.Set(context.Background(), key, value, ttl).Err()
}
