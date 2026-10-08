"""add phase2 fields to teams

Revision ID: 002_add_phase2_fields
Revises: 001_initial_phase2_tables
Create Date: 2026-10-08 18:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '002_add_phase2_fields'
down_revision: Union[str, None] = '001_initial_phase2_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Safely add nullable Phase 2 columns to teams table
    op.add_column('teams', sa.Column('source_team_id', sa.String(length=50), nullable=True))
    op.add_column('teams', sa.Column('room', sa.String(length=50), nullable=True))
    op.add_column('teams', sa.Column('leader_name', sa.String(length=150), nullable=True))
    op.add_column('teams', sa.Column('grade', sa.String(length=50), nullable=True))
    op.add_column('teams', sa.Column('score_real_business', sa.Float(), nullable=True))
    op.add_column('teams', sa.Column('score_chatbot_rag', sa.Float(), nullable=True))
    op.add_column('teams', sa.Column('score_database', sa.Float(), nullable=True))
    op.add_column('teams', sa.Column('score_platform', sa.Float(), nullable=True))
    op.add_column('teams', sa.Column('score_team_understanding', sa.Float(), nullable=True))
    op.add_column('teams', sa.Column('score_presentation', sa.Float(), nullable=True))
    op.add_column('teams', sa.Column('category_scores', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('teams', 'category_scores')
    op.drop_column('teams', 'score_presentation')
    op.drop_column('teams', 'score_team_understanding')
    op.drop_column('teams', 'score_platform')
    op.drop_column('teams', 'score_database')
    op.drop_column('teams', 'score_chatbot_rag')
    op.drop_column('teams', 'score_real_business')
    op.drop_column('teams', 'grade')
    op.drop_column('teams', 'leader_name')
    op.drop_column('teams', 'room')
    op.drop_column('teams', 'source_team_id')
