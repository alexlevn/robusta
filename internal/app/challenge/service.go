package challenge

import (
	"context"

	"github.com/pkg/errors"
	"github.com/pthethanh/robusta/internal/app/auth"
	"github.com/pthethanh/robusta/internal/app/policy"
	"github.com/pthethanh/robusta/internal/app/types"
	"github.com/pthethanh/robusta/internal/pkg/validator"
)

type (
	PolicyService interface {
		IsAllowed(ctx context.Context, sub policy.Subject, obj policy.Object, act policy.Action) bool
		MakeOwner(ctx context.Context, sub policy.Subject, obj policy.Object) error
	}

	Repository interface {
		Insert(ctx context.Context, c *types.Challenge) error
		FindByID(ctx context.Context, id string) (*types.Challenge, error)
		FindAll(ctx context.Context, r FindRequest) ([]*types.Challenge, error)
		Delete(cxt context.Context, id string) error
	}
	Service struct {
		repo   Repository
		policy PolicyService
	}
)

func NewService(repo Repository, policy PolicyService) *Service {
	return &Service{
		repo:   repo,
		policy: policy,
	}
}

func (s *Service) Create(ctx context.Context, c *types.Challenge) error {
	if err := validator.Validate(c); err != nil {
		return err
	}
	user := auth.FromContext(ctx)
	if user != nil {
		c.CreatedByID = user.UserID
		c.CreatedByName = user.GetName()
		c.CreatedByAvatar = user.AvatarURL
	}
	if err := s.repo.Insert(ctx, c); err != nil {
		return errors.Wrap(err, "failed to insert challenge")
	}
	if err := s.policy.MakeOwner(ctx, policy.UserSubject(user.UserID), policy.ChallengeObject(c.ID)); err != nil {
		return errors.Wrap(err, "failed to set permission")
	}
	return nil
}

func (s *Service) Get(ctx context.Context, id string) (*types.Challenge, error) {
	c, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, errors.Wrap(err, "failed to find the challenge")
	}
	return c, nil
}

func (s *Service) FindAll(ctx context.Context, r FindRequest) ([]*types.Challenge, error) {
	challenges, err := s.repo.FindAll(ctx, r)
	if err != nil {
		return nil, errors.Wrap(err, "failed to find challenges")
	}
	return challenges, nil
}

func (s *Service) Delete(ctx context.Context, id string) error {
	if err := policy.IsCurrentUserAllowed(ctx, s.policy, policy.ChallengeObject(id), policy.ActionDelete); err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}