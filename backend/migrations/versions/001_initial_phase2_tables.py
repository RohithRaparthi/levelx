"""create initial phase2 tables

Revision ID: 001_initial_phase2_tables
Revises: 
Create Date: 2026-09-02 08:35:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_phase2_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create phases table
    op.create_table(
        'phases',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('theme', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='upcoming'),
        sa.Column('date', sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # 2. Create students table
    op.create_table(
        'students',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('college', sa.String(length=255), nullable=True),
        sa.Column('participant_id', sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_students_participant_id'), 'students', ['participant_id'], unique=True)

    # 3. Create teams table
    op.create_table(
        'teams',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('phase_id', sa.Integer(), nullable=False),
        sa.Column('team_name', sa.String(length=150), nullable=False),
        sa.Column('project_name', sa.String(length=200), nullable=True),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('rank', sa.Integer(), nullable=True),
        sa.Column('award', sa.String(length=150), nullable=True),
        sa.Column('project_description', sa.Text(), nullable=True),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('demo_url', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['phase_id'], ['phases.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_teams_phase_id'), 'teams', ['phase_id'], unique=False)

    # 4. Create team_members table
    op.create_table(
        'team_members',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('team_id', sa.Integer(), nullable=False),
        sa.Column('student_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['student_id'], ['students.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('team_id', 'student_id', name='uq_team_student')
    )
    op.create_index(op.f('ix_team_members_student_id'), 'team_members', ['student_id'], unique=False)
    op.create_index(op.f('ix_team_members_team_id'), 'team_members', ['team_id'], unique=False)

    # 5. Create highlights table
    op.create_table(
        'highlights',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('media_url', sa.String(length=500), nullable=False),
        sa.Column('media_type', sa.String(length=50), nullable=False, server_default='image'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('highlights')
    op.drop_index(op.f('ix_team_members_team_id'), table_name='team_members')
    op.drop_index(op.f('ix_team_members_student_id'), table_name='team_members')
    op.drop_table('team_members')
    op.drop_index(op.f('ix_teams_phase_id'), table_name='teams')
    op.drop_table('teams')
    op.drop_index(op.f('ix_students_participant_id'), table_name='students')
    op.drop_table('students')
    op.drop_table('phases')
